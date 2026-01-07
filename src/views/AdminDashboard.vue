<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
    <!-- Top Navigation -->
    <div class="bg-gradient-to-r from-amber-900 to-amber-800 text-white px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-amber-700 w-10 h-10 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="scale-balanced" class="text-xl" />
          </div>
          <div>
            <h1 class="text-base font-bold">Butuan City Legal Information System</h1>
            <p class="text-xs text-amber-200">Administrator Dashboard</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-right hidden md:block">
            <p class="text-xs text-amber-200">Welcome, Admin</p>
            <p class="text-sm font-medium">{{ user?.name || 'Administrator' }}</p>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="activeTab = 'dashboard'"
              class="p-2 hover:bg-amber-700/50 rounded-lg transition-colors duration-200"
              title="Dashboard"
            >
              <font-awesome-icon icon="gauge-high" />
            </button>
            
            <button 
              @click="handleLogout"
              class="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <font-awesome-icon icon="right-from-bracket" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Navigation -->
    <div class="bg-white shadow-md border-b border-amber-200">
      <div class="flex overflow-x-auto px-4">
        <button 
          v-for="tab in adminTabs" 
          :key="tab.id"
          :class="[
            'py-3 px-4 font-medium flex items-center gap-2 transition-colors duration-200 whitespace-nowrap',
            activeTab === tab.id 
              ? 'text-amber-700 border-b-2 border-amber-700 bg-amber-50' 
              : 'text-amber-900 hover:text-amber-700 hover:bg-amber-50'
          ]"
          @click="activeTab = tab.id"
        >
          <font-awesome-icon :icon="tab.icon" />
          <span>{{ tab.name }}</span>
          <span v-if="tab.count !== undefined" 
            :class="[
              'text-xs rounded-full px-2 py-0.5',
              activeTab === tab.id 
                ? 'bg-amber-700 text-white' 
                : 'bg-amber-100 text-amber-800'
            ]">
            {{ tab.count }}
          </span>
          <!-- Pending badge for users tab -->
          <span v-if="tab.id === 'users' && pendingLawyerCount > 0"
            class="text-xs rounded-full px-2 py-0.5 bg-orange-500 text-white animate-pulse">
            {{ pendingLawyerCount }} pending
          </span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="px-4 py-6 max-w-7xl mx-auto">
      <!-- Dashboard Overview -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-amber-800 to-amber-700 text-white rounded-2xl p-6 shadow-lg">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold mb-2">Welcome back, Admin</h2>
              <p class="text-amber-100">Manage Butuan City ordinances and legal information</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-amber-300 text-sm">
                Last login: {{ lastLoginTime }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Ordinances Card -->
          <div class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-700">Total Ordinances</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ ordinanceStore.ordinances.length }}</p>
              </div>
              <div class="bg-amber-100 p-3 rounded-lg">
                <font-awesome-icon icon="file-lines" class="text-amber-600 text-xl" />
              </div>
            </div>
            <p class="text-xs text-amber-600 mt-3">
              <span class="text-green-600 font-medium">{{ ordinanceStore.activeOrdinances.length }} active</span>
              • {{ ordinanceStore.draftOrdinances.length }} drafts
            </p>
          </div>

          <!-- Total Users Card -->
          <div class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="activeTab = 'users'">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-700">Total Users</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ totalUsers }}</p>
              </div>
              <div class="bg-blue-100 p-3 rounded-lg">
                <font-awesome-icon icon="users" class="text-blue-600 text-xl" />
              </div>
            </div>
            <p class="text-xs text-amber-600 mt-3">
              <span class="text-green-600 font-medium">{{ clientCount }} clients</span>
              • {{ lawyerCount }} lawyers
            </p>
          </div>

          <!-- Pending Lawyers Card -->
          <div class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="activeTab = 'users'; usersSubTab = 'pending'"
            :class="pendingLawyerCount > 0 ? 'ring-2 ring-orange-400' : ''">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-700">Pending Lawyers</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ pendingLawyerCount }}</p>
              </div>
              <div class="bg-orange-100 p-3 rounded-lg" :class="pendingLawyerCount > 0 ? 'animate-pulse' : ''">
                <font-awesome-icon icon="clock" class="text-orange-600 text-xl" />
              </div>
            </div>
            <p class="text-xs text-orange-600 mt-3 font-medium">
              {{ pendingLawyerCount > 0 ? 'Needs your approval!' : 'No pending applications' }}
            </p>
          </div>

          <!-- Categories Card -->
          <div class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-700">Categories</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ ordinanceStore.categories.length }}</p>
              </div>
              <div class="bg-amber-100 p-3 rounded-lg">
                <font-awesome-icon icon="tags" class="text-amber-600 text-xl" />
              </div>
            </div>
            <p class="text-xs text-amber-600 mt-3">
              Most used: {{ mostUsedCategory }}
            </p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            @click="modalStore.openOrdinanceModal()"
            class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-amber-400 group"
          >
            <div class="flex items-center gap-4">
              <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors duration-200">
                <font-awesome-icon icon="file-circle-plus" class="text-amber-600 text-xl" />
              </div>
              <div class="text-left">
                <h4 class="font-bold text-amber-900">Add New Ordinance</h4>
                <p class="text-sm text-amber-600 mt-1">Create a new legal ordinance</p>
              </div>
            </div>
          </button>

          <button 
            @click="modalStore.openAddCategoryModal()"
            class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-amber-400 group"
          >
            <div class="flex items-center gap-4">
              <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors duration-200">
                <font-awesome-icon icon="folder-plus" class="text-amber-600 text-xl" />
              </div>
              <div class="text-left">
                <h4 class="font-bold text-amber-900">Manage Categories</h4>
                <p class="text-sm text-amber-600 mt-1">Add or edit ordinance categories</p>
              </div>
            </div>
          </button>

          <button 
            @click="activeTab = 'ordinances'"
            class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-amber-400 group"
          >
            <div class="flex items-center gap-4">
              <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors duration-200">
                <font-awesome-icon icon="chart-bar" class="text-amber-600 text-xl" />
              </div>
              <div class="text-left">
                <h4 class="font-bold text-amber-900">View Analytics</h4>
                <p class="text-sm text-amber-600 mt-1">Check ordinance performance</p>
              </div>
            </div>
          </button>
        </div>

        <!-- Recent Ordinances & Popular Ordinances -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Ordinances -->
          <div class="bg-white rounded-xl shadow-sm border border-amber-200">
            <div class="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
              <h3 class="text-lg font-bold text-amber-900">Recent Ordinances</h3>
              <p class="text-sm text-amber-600 mt-1">Recently added or updated</p>
            </div>
            <div class="p-4">
              <div v-if="ordinanceStore.recentOrdinances.length === 0" class="text-center py-8">
                <font-awesome-icon icon="inbox" class="text-4xl text-amber-300 mb-3" />
                <p class="text-amber-600">No recent ordinances</p>
                <button 
                  @click="modalStore.openOrdinanceModal()"
                  class="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors duration-200"
                >
                  <font-awesome-icon icon="plus" />
                  <span>Add First Ordinance</span>
                </button>
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="ordinance in ordinanceStore.recentOrdinances" 
                  :key="ordinance.id"
                  class="p-3 border border-amber-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors duration-200 cursor-pointer"
                  @click="modalStore.openViewOrdinanceModal(ordinance)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="font-medium text-amber-900 line-clamp-1">{{ ordinance.title }}</h4>
                      <p class="text-xs text-amber-600 mt-1">{{ ordinance.ordinanceNumber }}</p>
                    </div>
                    <span :class="getStatusClass(ordinance.status)" 
                      class="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                      {{ ordinance.status }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-amber-700">{{ ordinance.category }}</span>
                    <span class="text-xs text-amber-600">{{ ordinance.lastUpdated }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 border-t border-amber-200">
              <button 
                @click="activeTab = 'ordinances'"
                class="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium transition-colors duration-200"
              >
                View All Ordinances
              </button>
            </div>
          </div>

          <!-- Popular Ordinances -->
          <div class="bg-white rounded-xl shadow-sm border border-amber-200">
            <div class="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
              <h3 class="text-lg font-bold text-amber-900">Popular Ordinances</h3>
              <p class="text-sm text-amber-600 mt-1">Most viewed by users</p>
            </div>
            <div class="p-4">
              <div v-if="ordinanceStore.popularOrdinances.length === 0" class="text-center py-8">
                <font-awesome-icon icon="chart-line" class="text-4xl text-amber-300 mb-3" />
                <p class="text-amber-600">No popular ordinances yet</p>
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="ordinance in ordinanceStore.popularOrdinances" 
                  :key="ordinance.id"
                  class="p-3 border border-amber-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors duration-200 cursor-pointer"
                  @click="modalStore.openViewOrdinanceModal(ordinance)"
                >
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium text-amber-900 line-clamp-1">{{ ordinance.title }}</h4>
                    <span class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full whitespace-nowrap">
                      {{ ordinance.views }} views
                    </span>
                  </div>
                  <p class="text-sm text-amber-700 mt-2 line-clamp-2">{{ ordinance.description }}</p>
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-2">
                    <span class="text-xs text-amber-600">{{ ordinance.category }}</span>
                    <div class="flex gap-2">
                      <span v-for="tag in ordinance.tags.slice(0, 2)" :key="tag" 
                        class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Overview -->
        <div class="bg-white rounded-xl shadow-sm border border-amber-200">
          <div class="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-amber-900">Categories Overview</h3>
                <p class="text-sm text-amber-600 mt-1">Ordinances by category</p>
              </div>
              <button 
                @click="modalStore.openAddCategoryModal()"
                class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <font-awesome-icon icon="plus" />
                <span>Add Category</span>
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="[category, count] in Object.entries(ordinanceStore.ordinanceCountByCategory)" 
                :key="category"
                class="p-4 border border-amber-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors duration-200 cursor-pointer"
                @click="filterByCategory(category)"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-amber-900 line-clamp-1">{{ category }}</h4>
                  <span class="bg-amber-100 text-amber-800 text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap">
                    {{ count }}
                  </span>
                </div>
                <div class="w-full bg-amber-200 rounded-full h-2">
                  <div 
                    :style="{ width: `${(count / maxOrdinanceCount) * 100}%` }"
                    class="bg-amber-600 h-2 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management Section -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center gap-3">
            <font-awesome-icon icon="check-circle" class="text-green-500" />
            <p class="text-green-700 text-sm">{{ successMessage }}</p>
          </div>
        </div>

        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center gap-3">
            <font-awesome-icon icon="circle-exclamation" class="text-red-500" />
            <p class="text-red-700 text-sm">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl shadow-md p-5 border border-amber-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Total Users</p>
                <p class="text-2xl font-bold text-gray-800">{{ totalUsers }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <font-awesome-icon icon="users" class="text-2xl text-blue-600" />
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              <span class="text-orange-600">{{ suspendedCount }} suspended</span>
            </p>
          </div>

          <div class="bg-white rounded-xl shadow-md p-5 border border-amber-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Clients</p>
                <p class="text-2xl font-bold text-gray-800">{{ clientCount }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <font-awesome-icon icon="user-tie" class="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-5 border border-amber-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Lawyers</p>
                <p class="text-2xl font-bold text-gray-800">{{ lawyerCount }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <font-awesome-icon icon="scale-balanced" class="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-5 border border-amber-200"
            :class="pendingLawyerCount > 0 ? 'ring-2 ring-orange-400' : ''">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Pending Lawyers</p>
                <p class="text-2xl font-bold text-gray-800">{{ pendingLawyerCount }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
                :class="pendingLawyerCount > 0 ? 'animate-pulse' : ''">
                <font-awesome-icon icon="clock" class="text-2xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-xl shadow-md border border-amber-200">
          <div class="border-b border-gray-200">
            <div class="flex">
              <button
                @click="usersSubTab = 'pending'"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors relative',
                  usersSubTab === 'pending'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                <font-awesome-icon icon="clock" class="mr-2" />
                Pending Lawyers ({{ pendingLawyerCount }})
                <span v-if="pendingLawyerCount > 0" 
                  class="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
              </button>
              <button
                @click="usersSubTab = 'all'"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
                  usersSubTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                <font-awesome-icon icon="users" class="mr-2" />
                All Users ({{ totalUsers }})
              </button>
            </div>
          </div>

          <!-- Pending Lawyers Tab Content -->
          <div v-if="usersSubTab === 'pending'" class="p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Lawyer Applications Pending Approval</h3>
            
            <div v-if="pendingLawyers.length === 0" class="text-center py-12">
              <font-awesome-icon icon="check-circle" class="text-6xl text-gray-300 mb-4" />
              <p class="text-gray-500">No pending lawyer applications</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="lawyer in pendingLawyers"
                :key="lawyer.id"
                class="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                        <span class="text-purple-700 font-semibold text-lg">{{ getUserInitials(lawyer.name) }}</span>
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-900 text-lg">{{ lawyer.name }}</h4>
                        <p class="text-sm text-gray-500">Applied on {{ formatDate(lawyer.createdAt) }}</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p class="text-xs text-gray-500 mb-1">Email</p>
                        <p class="text-sm font-medium text-gray-900">{{ lawyer.email }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">Phone</p>
                        <p class="text-sm font-medium text-gray-900">{{ lawyer.phone }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">PRC/Bar Number</p>
                        <p class="text-sm font-medium text-gray-900">{{ lawyer.barNumber }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">Years of Practice</p>
                        <p class="text-sm font-medium text-gray-900">{{ lawyer.yearsOfPractice }} years</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">Law Firm/Office</p>
                        <p class="text-sm font-medium text-gray-900">{{ lawyer.lawFirm }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">Specialization</p>
                        <p class="text-sm font-medium text-gray-900">{{ lawyer.specialization }}</p>
                      </div>
                      <div class="md:col-span-2">
                        <p class="text-xs text-gray-500 mb-1">Office Address</p>
                        <p class="text-sm font-medium text-gray-900">{{ lawyer.address }}</p>
                      </div>
                    </div>

                    <div class="flex gap-3">
                      <button
                        @click="approveLawyer(lawyer.id)"
                        class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <font-awesome-icon icon="check" />
                        Approve
                      </button>
                      <button
                        @click="rejectLawyer(lawyer.id)"
                        class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <font-awesome-icon icon="times" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- All Users Tab Content -->
          <div v-if="usersSubTab === 'all'" class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">All Registered Users</h3>
              <div class="flex gap-2">
                <button
                  @click="filterRole = 'all'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filterRole === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  All
                </button>
                <button
                  @click="filterRole = 'client'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filterRole === 'client'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  Clients
                </button>
                <button
                  @click="filterRole = 'lawyer'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filterRole === 'lawyer'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  Lawyers
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                          <span class="text-amber-700 font-semibold text-sm">{{ getUserInitials(user.name) }}</span>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">{{ user.name }}</p>
                          <p class="text-sm text-gray-500">{{ user.phone }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ user.email }}</td>
                    <td class="px-4 py-3">
                      <span
                        :class="{
                          'bg-green-100 text-green-700': user.role === 'client',
                          'bg-purple-100 text-purple-700': user.role === 'lawyer'
                        }"
                        class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                      >
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span
                        :class="{
                          'bg-green-100 text-green-700': user.status === 'active',
                          'bg-orange-100 text-orange-700': user.status === 'pending',
                          'bg-red-100 text-red-700': user.status === 'rejected',
                          'bg-gray-100 text-gray-700': user.status === 'suspended'
                        }"
                        class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                      >
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(user.createdAt) }}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <button
                          v-if="user.status === 'pending'"
                          @click="approveLawyer(user.id)"
                          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <font-awesome-icon icon="check" />
                        </button>
                        <button
                          v-if="user.status === 'active'"
                          @click="suspendUser(user.id)"
                          class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Suspend Account"
                        >
                          <font-awesome-icon icon="ban" />
                        </button>
                        <button
                          v-if="user.status === 'suspended'"
                          @click="activateUser(user.id)"
                          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Activate Account"
                        >
                          <font-awesome-icon icon="check-circle" />
                        </button>
                        <button
                          @click="deleteUser(user.id)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <font-awesome-icon icon="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-if="filteredUsers.length === 0" class="text-center py-12">
                <font-awesome-icon icon="users" class="text-6xl text-gray-300 mb-4" />
                <p class="text-gray-500">No users found</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ordinances Management -->
      <div v-if="activeTab === 'ordinances'" class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-2xl font-bold text-amber-900">Ordinances Management</h3>
              <p class="text-amber-700 mt-1">Manage all city ordinances and regulations</p>
            </div>
            <div class="flex gap-3">
              <button 
                @click="modalStore.openOrdinanceModal()"
                class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <font-awesome-icon icon="plus" />
                <span>Add New Ordinance</span>
              </button>
            </div>
          </div>
          
          <!-- Filters -->
          <div class="mt-6 flex flex-wrap gap-3">
            <button 
              v-for="filter in filters" 
              :key="filter.id"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                activeFilter === filter.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              ]"
              @click="activeFilter = filter.id"
            >
              {{ filter.name }}
              <span v-if="filter.count" class="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {{ filter.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Ordinances List -->
        <div class="bg-white rounded-xl shadow-sm border border-amber-200">
          <!-- Search and Actions -->
          <div class="p-4 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
            <div class="flex flex-col md:flex-row gap-3">
              <div class="flex-1 relative">
                <font-awesome-icon icon="magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search ordinances by title, number, or content..."
                  class="w-full pl-12 pr-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-colors duration-200"
                />
              </div>
              <select 
                v-model="selectedCategoryFilter"
                class="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-colors duration-200"
              >
                <option value="">All Categories</option>
                <option v-for="category in ordinanceStore.categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <!-- Ordinances Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-amber-50">
                <tr>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Title</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Category</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Status</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Views</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Last Updated</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-amber-200">
                <tr v-for="ordinance in filteredOrdinances" :key="ordinance.id" class="hover:bg-amber-50 transition-colors duration-200">
                  <td class="py-3 px-4">
                    <div>
                      <h4 class="font-medium text-amber-900 line-clamp-1">{{ ordinance.title }}</h4>
                      <p class="text-xs text-amber-600">{{ ordinance.ordinanceNumber }}</p>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm whitespace-nowrap">
                      {{ ordinance.category }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span :class="getStatusClass(ordinance.status)" 
                      class="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                      {{ ordinance.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <font-awesome-icon icon="eye" class="text-amber-500" />
                      <span class="font-medium text-amber-700">{{ ordinance.views }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-amber-600 whitespace-nowrap">{{ ordinance.lastUpdated }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <button 
                        @click="modalStore.openViewOrdinanceModal(ordinance)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="View"
                      >
                        <font-awesome-icon icon="eye" />
                      </button>
                      <button 
                        @click="modalStore.openOrdinanceModal(ordinance)"
                        class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Edit"
                      >
                        <font-awesome-icon icon="pen-to-square" />
                      </button>
                      <button 
                        @click="deleteOrdinance(ordinance.id)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete"
                      >
                        <font-awesome-icon icon="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredOrdinances.length === 0" class="text-center py-12">
            <font-awesome-icon icon="file-circle-question" class="text-5xl text-amber-300 mb-3" />
            <p class="text-amber-600 text-lg">No ordinances found</p>
            <p class="text-amber-500 text-sm mt-1">Try changing your search or filters</p>
            <button 
              @click="modalStore.openOrdinanceModal()"
              class="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors duration-200"
            >
              <font-awesome-icon icon="plus" />
              <span>Add Your First Ordinance</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Categories Management -->
      <div v-if="activeTab === 'categories'" class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-2xl font-bold text-amber-900">Categories Management</h3>
              <p class="text-amber-700 mt-1">Manage ordinance categories</p>
            </div>
            <button 
              @click="modalStore.openAddCategoryModal()"
              class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
            >
              <font-awesome-icon icon="plus" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="category in ordinanceStore.categories" 
            :key="category"
            class="bg-white rounded-xl p-6 shadow-sm border border-amber-200 hover:border-amber-400 transition-colors duration-200"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-amber-900 line-clamp-1">{{ category }}</h4>
              <span class="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                {{ ordinanceStore.ordinanceCountByCategory[category] || 0 }}
              </span>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-amber-600">Active Ordinances</span>
                <span class="font-medium text-green-600">
                  {{ getActiveOrdinancesCount(category) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-amber-600">Total Views</span>
                <span class="font-medium text-blue-600">
                  {{ getCategoryViews(category) }}
                </span>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <button 
                @click="editCategory(category)"
                class="flex-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium transition-colors duration-200"
              >
                Edit
              </button>
              <button 
                @click="deleteCategory(category)"
                :disabled="ordinanceStore.ordinanceCountByCategory[category] > 0"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg font-medium transition-colors duration-200',
                  ordinanceStore.ordinanceCountByCategory[category] > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                ]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h3 class="text-2xl font-bold text-amber-900">Analytics Dashboard</h3>
              <p class="text-amber-700 mt-1">Ordinance performance and user insights</p>
            </div>
            <select class="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-colors duration-200">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
          
          <!-- Analytics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
              <div class="flex items-center gap-4">
                <div class="bg-amber-600 p-3 rounded-lg">
                  <font-awesome-icon icon="users" class="text-white text-xl" />
                </div>
                <div>
                  <p class="text-sm text-amber-600">Active Users</p>
                  <p class="text-2xl font-bold text-amber-900">1,247</p>
                </div>
              </div>
              <p class="text-xs text-amber-600 mt-3">↑ 12% from last week</p>
            </div>
            
            <div class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
              <div class="flex items-center gap-4">
                <div class="bg-amber-600 p-3 rounded-lg">
                  <font-awesome-icon icon="message" class="text-white text-xl" />
                </div>
                <div>
                  <p class="text-sm text-amber-600">Chatbot Queries</p>
                  <p class="text-2xl font-bold text-amber-900">3,458</p>
                </div>
              </div>
              <p class="text-xs text-amber-600 mt-3">↑ 24% from last week</p>
            </div>
            
            <div class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
              <div class="flex items-center gap-4">
                <div class="bg-amber-600 p-3 rounded-lg">
                  <font-awesome-icon icon="file-contract" class="text-white text-xl" />
                </div>
                <div>
                  <p class="text-sm text-amber-600">Ordinance Clicks</p>
                  <p class="text-2xl font-bold text-amber-900">8,923</p>
                </div>
              </div>
              <p class="text-xs text-amber-600 mt-3">↑ 18% from last week</p>
            </div>
          </div>
          
          <!-- Coming Soon -->
          <div class="mt-8 p-8 bg-gradient-to-r from-amber-800 to-amber-700 rounded-xl text-center">
            <font-awesome-icon icon="chart-line" class="text-amber-200 text-5xl mb-4" />
            <h4 class="text-xl font-bold text-white mb-2">Advanced Analytics Coming Soon</h4>
            <p class="text-amber-200">Detailed charts and insights are being developed to help you understand ordinance usage patterns.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Components -->
    <OrdinanceModal />
    <AddCategoryModal />
    <ViewOrdinanceModal />

    <!-- Help Button -->
    <button class="fixed bottom-6 right-6 w-12 h-12 bg-amber-800 hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 z-50">
      <font-awesome-icon icon="question" class="text-xl" />
    </button>
  </div>
</template>

<script setup>
import { api } from '@/services/api'
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrdinanceStore } from '@/stores/ordinance'
import { useModalStore } from '@/stores/modal'
import { useRouter } from 'vue-router'
import OrdinanceModal from '@/components/clients/OrdinanceModal.vue'
import AddCategoryModal from '@/components/clients/AddCategoryModal.vue'
import ViewOrdinanceModal from '@/components/clients/ViewOrdinanceModal.vue'



const authStore = useAuthStore()
const ordinanceStore = useOrdinanceStore()
const modalStore = useModalStore()
const router = useRouter()

const user = ref(null)
const activeTab = ref('dashboard')
const usersSubTab = ref('pending')
const activeFilter = ref('all')
const searchQuery = ref('')
const selectedCategoryFilter = ref('')
const filterRole = ref('all')
const successMessage = ref('')
const errorMessage = ref('')
const users = ref([])

// User Management Computed Properties
// User Management Computed Properties
const totalUsers = computed(() => 
  users.value.filter(u => u.status === 'approved').length
)
const clientCount = computed(() => 
  users.value.filter(u => u.role === 'client' && u.status === 'approved').length
)
const lawyerCount = computed(() => 
  users.value.filter(u => u.role === 'lawyer' && u.status === 'approved').length
)
const pendingLawyerCount = computed(() => 
  users.value.filter(u => u.role === 'lawyer' && u.status === 'pending').length
)
const suspendedCount = computed(() => 
  users.value.filter(u => u.status === 'suspended').length
)


const pendingLawyers = computed(() => 
  users.value.filter(u => u.role === 'lawyer' && u.status === 'pending')
)

const filteredUsers = computed(() => {
  if (filterRole.value === 'all') {
    return users.value
  }
  return users.value.filter(u => u.role === filterRole.value)
})

const adminTabs = computed(() => [
  { id: 'dashboard', name: 'Dashboard', icon: 'gauge-high' },
  { id: 'users', name: 'Users', icon: 'users', count: totalUsers.value },
  { id: 'ordinances', name: 'Ordinances', icon: 'file-lines', count: ordinanceStore.ordinances.length },
  { id: 'categories', name: 'Categories', icon: 'tags', count: ordinanceStore.categories.length },
  { id: 'analytics', name: 'Analytics', icon: 'chart-simple' }
])

const filters = computed(() => [
  { id: 'all', name: 'All Ordinances', count: ordinanceStore.ordinances.length },
  { id: 'active', name: 'Active', count: ordinanceStore.activeOrdinances.length },
  { id: 'draft', name: 'Drafts', count: ordinanceStore.draftOrdinances.length }
])

const totalViews = computed(() => {
  return ordinanceStore.ordinances.reduce((sum, ord) => sum + ord.views, 0)
})

const mostViewedOrdinance = computed(() => {
  const popular = ordinanceStore.popularOrdinances[0]
  return popular ? popular.title : 'None'
})

const mostUsedCategory = computed(() => {
  const counts = ordinanceStore.ordinanceCountByCategory
  const entries = Object.entries(counts)
  if (entries.length === 0) return 'None'
  
  const max = Math.max(...Object.values(counts))
  const category = entries.find(([_, count]) => count === max)
  return category ? category[0] : 'None'
})

const recentOrdinancesCount = computed(() => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return ordinanceStore.ordinances.filter(ord => {
    const updated = new Date(ord.lastUpdated)
    return updated >= sevenDaysAgo
  }).length
})

const lastLoginTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const maxOrdinanceCount = computed(() => {
  const counts = Object.values(ordinanceStore.ordinanceCountByCategory)
  return counts.length > 0 ? Math.max(...counts) : 1
})

const filteredOrdinances = computed(() => {
  let filtered = ordinanceStore.ordinances

  if (activeFilter.value === 'active') {
    filtered = filtered.filter(ord => ord.status === 'active')
  } else if (activeFilter.value === 'draft') {
    filtered = filtered.filter(ord => ord.status === 'draft')
  }

  if (selectedCategoryFilter.value) {
    filtered = filtered.filter(ord => ord.category === selectedCategoryFilter.value)
  }

  if (searchQuery.value.trim()) {
    filtered = ordinanceStore.searchOrdinances(searchQuery.value)
    
    if (activeFilter.value === 'active') {
      filtered = filtered.filter(ord => ord.status === 'active')
    } else if (activeFilter.value === 'draft') {
      filtered = filtered.filter(ord => ord.status === 'draft')
    }
    
    if (selectedCategoryFilter.value) {
      filtered = filtered.filter(ord => ord.category === selectedCategoryFilter.value)
    }
  }

  return filtered
})

// User Management Methods
const loadUsers = async () => {
  try {
    const data = await api.get('/admin/users') // adjust URL to your backend route
    users.value = data.users || data
  } catch (e) {
    console.error('Failed to load users', e)
    errorMessage.value = 'Failed to load users'
  }
}


const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const approveLawyer = async (userId) => {
  if (!confirm('Approve this lawyer application?')) return

  try {
    await api.post(`/admin/lawyers/${userId}/approve`)

    successMessage.value = 'Lawyer application approved successfully!'

    // Reload from backend so status reflects DB
    await loadUsers()

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (e) {
    console.error('Failed to approve lawyer', e)
    errorMessage.value = 'Failed to approve lawyer'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}


const rejectLawyer = (userId) => {
  if (confirm('Reject this lawyer application? This will delete the account.')) {
    users.value = users.value.filter(u => u.id !== userId)
    localStorage.setItem('registeredUsers', JSON.stringify(users.value))
    successMessage.value = 'Lawyer application rejected and removed.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}

const deleteUser = (userId) => {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    users.value = users.value.filter(u => u.id !== userId)
    localStorage.setItem('registeredUsers', JSON.stringify(users.value))
    successMessage.value = 'User deleted successfully'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  }
}

const suspendUser = (userId) => {
  if (confirm('Suspend this user account? The user will not be able to login until reactivated.')) {
    const userIndex = users.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex].status = 'suspended'
      users.value[userIndex].suspendedAt = new Date().toISOString()
      localStorage.setItem('registeredUsers', JSON.stringify(users.value))
      successMessage.value = 'User account suspended successfully'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  }
}

const activateUser = (userId) => {
  if (confirm('Activate this user account? The user will be able to login again.')) {
    const userIndex = users.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex].status = 'active'
      users.value[userIndex].activatedAt = new Date().toISOString()
      delete users.value[userIndex].suspendedAt
      localStorage.setItem('registeredUsers', JSON.stringify(users.value))
      successMessage.value = 'User account activated successfully'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  }
}

onMounted(() => {
  user.value = authStore.user
  if (user.value?.role !== 'admin') {
    router.push('/login')
    return
  }
  loadUsers()
})

const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'draft': 'bg-yellow-100 text-yellow-800',
    'archived': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getActiveOrdinancesCount = (category) => {
  return ordinanceStore.ordinances.filter(ord => 
    ord.category === category && ord.status === 'active'
  ).length
}

const getCategoryViews = (category) => {
  return ordinanceStore.ordinances
    .filter(ord => ord.category === category)
    .reduce((sum, ord) => sum + ord.views, 0)
}

const deleteOrdinance = (ordinanceId) => {
  if (confirm('Are you sure you want to delete this ordinance? This action cannot be undone.')) {
    ordinanceStore.deleteOrdinance(ordinanceId)
  }
}

const editCategory = (category) => {
  const newName = prompt('Enter new category name:', category)
  if (newName && newName !== category && newName.trim()) {
    ordinanceStore.ordinances.forEach(ord => {
      if (ord.category === category) {
        ord.category = newName
      }
    })
    const index = ordinanceStore.categories.indexOf(category)
    if (index !== -1) {
      ordinanceStore.categories[index] = newName
    }
  }
}

const deleteCategory = (category) => {
  if (ordinanceStore.ordinanceCountByCategory[category] > 0) {
    alert('Cannot delete category that has ordinances assigned. Please reassign or delete those ordinances first.')
    return
  }
  
  if (confirm(`Are you sure you want to delete the "${category}" category?`)) {
    const index = ordinanceStore.categories.indexOf(category)
    if (index !== -1) {
      ordinanceStore.categories.splice(index, 1)
    }
  }
}

const filterByCategory = (category) => {
  activeTab.value = 'ordinances'
  selectedCategoryFilter.value = category
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>   